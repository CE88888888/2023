println(ARGS[begin])
day = ARGS[begin]
path = pwd() * "\\day" * day

mkpath(path)
touch(path * "\\ex.txt")
touch(path * "\\input.txt")
if !isfile(path * "\\day" * day * ".jl")
	touch(path * "\\day" * day * ".jl")
	open(path * "\\day" * day * ".jl", "w") do f
		open(pwd() * "\\helper\\jltemplate.txt", "r") do t
			s = read(t, String)
			write(f, s)
		end
	end
end
