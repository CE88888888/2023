include(pwd() * "\\helper\\inputs.jl")
example = getExample(@__DIR__)
input = getInput(@__DIR__)

struct CubeSet
	red::Integer
	green::Integer
	blue::Integer
end

function parseToCubeSet(raw)
	red = green = blue = 0
	for cube in raw
		(amount, colour) = split(lstrip(cube), " ")
		if colour == "red"
			red = parse(Int, amount)
		elseif colour == "green"
			green = parse(Int, amount)
		elseif colour == "blue"
			blue = parse(Int, amount)
		end
	end
	CubeSet(red, green, blue)
end

function solve(lines, part)
	lines = split.(lines, ":")
	games = []
	sum = 0
	for line in lines
		line[begin] = replace(line[begin], "Game " => "")
		setsraw = split(line[end], ";")
		cubeSet = parseToCubeSet.(split.(setsraw, ","))
		push!(games, (id = line[begin], set = cubeSet))
	end
	for game in games
		maxred = maximum(getfield.(game.set, :red))
		maxgreen = maximum(getfield.(game.set, :green))
		maxblue = maximum(getfield.(game.set, :blue))
		if part == 1 && maxred < 13 && maxgreen < 14 && maxblue < 15
			sum += parse(Int, game.id)
		end
		if part == 2
			sum += (maxred * maxgreen * maxblue)
		end
	end
	return sum
end

println("Part 1 example : $(solve(example, 1))")
println("Part 1 solution: $(solve(input,1))")
println("Part 2 example : $(solve(example,2))")
println("Part 2 solution: $(solve(input,2))")

