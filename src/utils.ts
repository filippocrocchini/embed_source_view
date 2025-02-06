type LineRange = {
	from : number
	to   : number
} 

export function parseRanges(str: string): LineRange[]
{
	if(!str) return []

	// Remove all spaces
	str = str.replace(/\s*/g, "")

	const result: LineRange[] = []
	const intervals = str.split(",")
	
	for(const it of intervals)
	{
		if(/\w+-\w+/.test(it))
		{
			const [min_str, max_str] = it.split('-')
			const min = Number(min_str)
			const max = Number(max_str)
			
			if((min && max) && min <= max)
			{
				result.push({from: min, to: max})
			}
		}
		else 
		{
			const lineNumber = Number(it)
			result.push({from: lineNumber, to: lineNumber})
		}
	}

	return result
}

export function extractRanges(fileContent: string,  lineRanges: LineRange[]): string
{
    const lines  = fileContent.split("\n")
	let   result = "...\n"

	for(const range of lineRanges)
	{
		const start = Math.clamp(range.from, 0, lines.length - 1);
		const end   = Math.clamp(range.to,   0, lines.length - 1);

		for(let line_number = start; line_number <= end; line_number++)
		{
			result = result.concat(lines[line_number], "\n")
		}
		result = result.concat("...\n")
	}

    return result
}