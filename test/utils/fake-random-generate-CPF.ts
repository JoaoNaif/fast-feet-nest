export function generateFakeCPF(): string {
  const generateRandomNumbers = (length: number) =>
    Array.from({ length }, () => Math.floor(Math.random() * 9)).join('')

  const cpfWithoutCheckDigits = generateRandomNumbers(9)

  const calculateCheckDigit = (cpf: string) => {
    let sum = 0
    let factor = cpf.length + 1

    for (const digit of cpf) {
      sum += parseInt(digit) * factor--
    }

    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }

  const firstCheckDigit = calculateCheckDigit(cpfWithoutCheckDigits)
  const secondCheckDigit = calculateCheckDigit(
    cpfWithoutCheckDigits + firstCheckDigit,
  )

  const formattedCPF = `${cpfWithoutCheckDigits}${firstCheckDigit}${secondCheckDigit}`

  return `${formattedCPF.slice(0, 3)}.${formattedCPF.slice(3, 6)}.${formattedCPF.slice(6, 9)}-${formattedCPF.slice(9, 11)}`
}
