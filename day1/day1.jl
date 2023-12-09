include(pwd() * "\\helper\\inputs.jl")
example = getExample(@__DIR__)
input = getInput(@__DIR__)

function decodeNumber(s, advanced::Bool)
	if advanced
		s = replace(s,
			"twone" => "twoone",
			"oneight" => "oneeight",
			"threeight" => "threeeight",
			"fiveight" => "fiveeight",
			"sevenine" => "sevennine",
			"eightwo" => "eighttwo",
			"eighthree" => "eightthree")
		s = replace(s, "one" => "1", "two" => "2", "three" => "3", "four" => "4", "five" => "5", "six" => "6", "seven" => "7", "eight" => "8", "nine" => "9")
	end
	filter.(isdigit, s)
end

function part1(lines)
	lines = broadcast(decodeNumber, lines, false)
	sum(map(l -> parse(Int, (l[begin] * l[end])), lines))
end

function part2(lines)
	lines = broadcast(decodeNumber, lines, true)
	sum(map(l -> parse(Int, (l[begin] * l[end])), lines))
end

#println("Part 1 example : $(part1(example))") Part2 example breaks first
println("Part 1 solution: $(part1(input))")
println("Part 2 example : $(part2(example))")
println("Part 2 solution: $(part2(input))")

