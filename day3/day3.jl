include(pwd() * "\\helper\\inputs.jl")
using Profile
example = getExample(@__DIR__)
input = getInput(@__DIR__)

function part1(lines)
    lines = collect.(lines)
    arr = stack(lines, dims=2)
    parts = getParts(arr)

    sum = 0
    for n in parts
        xmin, xmax, ymin, ymax = getSafeBounds(n[2], n[2] + n[4] - 1, n[3], n[3], axes(arr, 2))
        area = @view arr[xmin:xmax, ymin:ymax]
        if !(all((isdigit(i) || i == '.') for (i) in area))
            sum += n[1]
        end
    end
    return sum
end

function part2(lines)
    lines = collect.(lines)
    arr = stack(lines, dims=2)
    parts = getParts(arr)


    stars = findall(x -> x == '*', arr)
    sum = 0
    for s in stars
        sx, sy = Tuple(s)
        xmin, xmax, ymin, ymax = getSafeBounds(sx, sx, sy, sy, axes(arr, 1))
        connected = findall((!isdisjoint(xmin:xmax, p[2]:p[2]+p[4]-1) && !isdisjoint(ymin:ymax, p[3]:p[3])) for p in parts)
        if length(connected) == 2
            sum += parts[connected[1]][1] * parts[connected[2]][1]
        end
    end
    return sum
end

function getParts(arr)
    current = ""
    x = y = length = 0
    parts = []
    for (i, v) in pairs(IndexCartesian(), arr)
        if isdigit(v)
            if current == ""
                (x, y) = Tuple(i)
                length = 0
            end
            current = current * v
            length += 1
        else
            if current != ""
                push!(parts, [parse(Int, current), x, y, length])
                current = ""
            end
        end
    end
    return parts
end

function getSafeBounds(xmin, xmax, ymin, ymax, dim)
    xmin = (xmin - 1 in dim) ? xmin - 1 : xmin
    xmax = (xmax + 1 in dim) ? xmax + 1 : xmax
    ymin = (ymin - 1 in dim) ? ymin - 1 : ymin
    ymax = (ymax + 1 in dim) ? ymax + 1 : ymax
    return (xmin=xmin, xmax=xmax, ymin=ymin, ymax=ymax)
end

println("Part 1 example : $(part1(example))")
println("Part 1 solution: $(part1(input))")
println("Part 2 example : $(part2(example))")
println("Part 2 solution: $(part2(input))")
