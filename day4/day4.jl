include(pwd() * "\\helper\\inputs.jl")
example = getExample(@__DIR__)
input = getInput(@__DIR__)

function part1(lines)
    cards = scoreCards(parseCards(lines))
    sum(map(c -> c[4], cards))
end

function part2(lines)
    cards = scoreCards(parseCards(lines))
    countedCards = Dict(first.(cards) .=> 1)
    for (k, (_, _, _, _, won)) in pairs(cards)
        c = countedCards[k]
        for i in k+1:k +won
            countedCards[i] += 1*c
        end
    end
    sum(values(countedCards))
end

function scoreCards(cards)
    for (k, (_, winning, having)) in pairs(cards)
        won = winning ∩ having
        score = 0
        if length(won) > 0
            score = 2^(length(won) - 1)
        end
        append!(cards[k], score)
        append!(cards[k], length(won))
    end
    return cards
end

function parseCards(lines)
    lines = replace.(lines, "Card " => "")
    result = []
    for line in lines
        (id, tail) = split(line, ":")
        id = parse(Int, strip(id))
        (winning, having) = map(x -> strip(x), split(tail, "|"))
        winning = map(c -> parse(Int, c), split(winning))
        having = map(c -> parse(Int, c), split(having))
        push!(result, [id, winning, having])
    end
    return result
end

println("Part 1 example : $(part1(example))")
println("Part 1 solution: $(part1(input))")
println("Part 2 example : $(part2(example))")
println("Part 2 solution: $(part2(input))")
