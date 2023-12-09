function getExample(dir)
	 open(dir*"\\ex.txt", "r") do f
	 return readlines(f)
     end
end
function getInput(dir)
	open(dir * "\\input.txt", "r") do f
	return readlines(f)
    end
end