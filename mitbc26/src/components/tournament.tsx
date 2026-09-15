import { Rect, Txt, Line, Node } from "@motion-canvas/2d";
import { createRefArray, all, sequence } from "@motion-canvas/core";
import { MonoTxt, get_rect_tournament_line } from "./helpers";

export type team = {
    name: string;
    score: string;
    won: boolean;
    font_size?: number;
};

export type first_round_box = team & {
    x: number;
    y: number;
};

export type later_round_opponent = team & {
    x: number;
    y: number;
    side: "top" | "bottom";
};

export type round = {
    opponent: later_round_opponent;
    self_score: string;
    result_pos: [number, number];
    advance: "self" | "opponent";
};

export type bracket_data = {
    top: first_round_box;
    bottom: first_round_box;
    first_result_pos: [number, number];
    rounds: round[];
};

const win_color = "#6db569";
const lose_color = "#b57469";
const top_color = "#B56985";
const bottom_color = "#BE9F86";
const result_color = "#fff";

const outcome_color = (t: team) => (t.won ? win_color : lose_color);

export const side_color = (side: "top" | "bottom") =>
    side === "top" ? top_color : bottom_color;

export type box_spec = {
    key: string;
    x: number;
    y: number;
    grow: boolean;
    name_color: string;
    outcome_color: string;
    font_size?: number;
};

export type line_spec = {
    from: string;
    to: string;
};

export function build_bracket_spec(data: bracket_data) {
    const boxes: box_spec[] = [];
    const lines: line_spec[] = [];

    boxes.push({
        key: "r0-top",
        x: data.top.x,
        y: data.top.y,
        grow: true,
        name_color: top_color,
        outcome_color: outcome_color(data.top),
        font_size: data.top.font_size,
    });

    boxes.push({
        key: "r0-bottom",
        x: data.bottom.x,
        y: data.bottom.y,
        grow: true,
        name_color: bottom_color,
        outcome_color: outcome_color(data.bottom),
        font_size: data.bottom.font_size,
    });

    let prev_result = "r0-result";

    boxes.push({
        key: prev_result,
        x: data.first_result_pos[0],
        y: data.first_result_pos[1],
        grow: false,
        name_color: result_color,
        outcome_color: win_color,
    });

    lines.push(
        { from: "r0-top", to: prev_result },
        { from: "r0-bottom", to: prev_result },
    );

    data.rounds.forEach((round, i) => {
        const opp_key = `r${i + 1}-opp`;
        const result_key = `r${i + 1}-result`;

        boxes.push({
            key: opp_key,
            x: round.opponent.x,
            y: round.opponent.y,
            grow: false,
            name_color: side_color(round.opponent.side),
            outcome_color: outcome_color(round.opponent),
            font_size: round.opponent.font_size,
        });

        boxes.push({
            key: result_key,
            x: round.result_pos[0],
            y: round.result_pos[1],
            grow: false,
            name_color: result_color,
            outcome_color: win_color,
        });

        lines.push(
            { from: prev_result, to: result_key },
            { from: opp_key, to: result_key },
        );

        prev_result = result_key;
    });

    return { boxes, lines };
}

export function add_bracket(docket_node: Node, data: bracket_data) {
    const { boxes, lines } = build_bracket_spec(data);
    const box_index: Record<string, number> = {};

    boxes.forEach((b, i) => {
        box_index[b.key] = i;
    });

    const box_rects = createRefArray<Rect>();
    const box_names = createRefArray<Txt>();
    const box_outcomes = createRefArray<Txt>();

    docket_node.add(
        <>
            {boxes.map((b) => (
                <Rect
                    ref={box_rects}
                    layout
                    direction={"row"}
                    alignItems={"center"}
                    width={b.grow ? 0 : 500}
                    x={b.x}
                    y={b.y}
                    scale={0}
                    padding={20}
                    gap={20}
                    fill={"#111111"}
                    lineWidth={8}
                    stroke={"#2B2B2B"}
                >
                    <MonoTxt
                        ref={box_names}
                        textAlign={"center"}
                        width={350}
                        fill={b.name_color}
                        fontSize={b.font_size}
                    />
                    <Line
                        points={[
                            [0, -40],
                            [0, 40],
                        ]}
                        lineWidth={4}
                        stroke={"#2b2b2b"}
                    />
                    <MonoTxt
                        ref={box_outcomes}
                        paddingLeft={20}
                        textAlign={"center"}
                        scale={0}
                        fill={b.outcome_color}
                    />
                </Rect>
            ))}
        </>,
    );

    const box_lines = createRefArray<Line>();

    docket_node.add(
        <>
            {lines.map((l) => (
                <Line
                    ref={box_lines}
                    points={get_rect_tournament_line(
                        box_rects[box_index[l.from]],
                        box_rects[box_index[l.to]],
                    )}
                    radius={8}
                    end={0}
                    lineWidth={6}
                    stroke={"#2b2b2b"}
                />
            ))}
        </>,
    );

    return {
        box_rects,
        box_names,
        box_outcomes,
        box_lines,
    };
}

type score_reveal = {
    idx: number;
    score: string;
};

type pending_reveals = {
    scores: score_reveal[];
    advancing_name_idx: number;
    advancing_name: string;
} | null;

export function create_bracket_player(docket_node: Node, data: bracket_data) {
    const {
        box_rects,
        box_names,
        box_outcomes,
        box_lines,
    } = add_bracket(docket_node, data);

    let round_index = 0;
    let box_cursor = 3;

    let advancing_name = data.top.won
        ? data.top.name
        : data.bottom.name;

    let pending: pending_reveals = null;

    function* reveal_winner() {
        if (!pending) return;

        yield* all(
            ...pending.scores.map((s) =>
                reveal_outcome(box_outcomes[s.idx], s.score),
            ),
        );

        yield* reveal_name(
            box_names[pending.advancing_name_idx],
            pending.advancing_name,
        );

        pending = null;
    }

    function* next_round() {
        if (round_index === 0) {
            yield* sequence(
                0.2,
                grow_in(box_rects[1]),
                grow_in(box_rects[0]),
            );

            yield* sequence(
                0.2,
                all(
                    box_lines[0].end(1, 0.5),
                    box_lines[1].end(1, 0.5),
                ),
                pop_in(box_rects[2]),
            );

            yield* sequence(
                0.1,
                reveal_name(box_names[1], data.bottom.name),
                reveal_name(box_names[0], data.top.name),
            );

            pending = {
                scores: [
                    { idx: 1, score: data.bottom.score },
                    { idx: 0, score: data.top.score },
                ],
                advancing_name_idx: 2,
                advancing_name,
            };

            round_index += 1;
            return;
        }

        const prev_result_idx = box_cursor - 1;
        const round = data.rounds[round_index - 1];

        const our_side =
            round.opponent.side === "top" ? "bottom" : "top";

        const opp_idx = box_cursor;
        const result_idx = box_cursor + 1;

        yield* all(
            box_names[prev_result_idx].fill(
                side_color(our_side),
                0.4,
            ),
            pop_in(box_rects[opp_idx]),
            follow_camera(
                docket_node,
                -300 - round.opponent.x,
                0.8,
            ),
        );

        yield* reveal_name(
            box_names[opp_idx],
            round.opponent.name,
        );

        yield* all(
            box_lines[2 + (round_index - 1) * 2].end(1, 0.5),
            box_lines[3 + (round_index - 1) * 2].end(1, 0.5),
        );

        yield* pop_in(box_rects[result_idx]);

        if (round.advance === "opponent") {
            advancing_name = round.opponent.name;
        }

        pending = {
            scores: [
                {
                    idx: prev_result_idx,
                    score: round.self_score,
                },
                {
                    idx: opp_idx,
                    score: round.opponent.score,
                },
            ],
            advancing_name_idx: result_idx,
            advancing_name,
        };

        box_cursor += 2;
        round_index += 1;
    }

    return {
        box_rects,
        box_names,
        box_outcomes,
        box_lines,
        next_round,
        reveal_winner,
    };
}

export function* grow_in(box: Rect) {
    yield* all(
        box.width(500, 0.8),
        box.scale(1, 0.4),
    );
}

export function* pop_in(box: Rect) {
    yield* box.scale(1, 0.4);
}

export function* reveal_name(txt: Txt, name: string) {
    yield* txt.text(name, 0.8);
}

export function* reveal_outcome(txt: Txt, score: string) {
    yield* all(
        txt.text(score, 0.01),
        txt.scale(1, 0.4),
    );
}

export function* follow_camera(docket_node: Node, x: number, duration = 0.8) {
    yield* docket_node.position.x(x, duration);
}