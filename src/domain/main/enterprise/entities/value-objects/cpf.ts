export class Cpf {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    return new Cpf(value)
  }

  static createFromText(text: string): Cpf {
    // Remove qualquer caractere que não seja um número
    const cleanedText = text.replace(/\D/g, '')

    // Verifica se o CPF tem exatamente 11 dígitos
    if (cleanedText.length !== 11) {
      throw new Error('CPF deve ter exatamente 11 dígitos.')
    }

    // Formata o CPF no padrão XXX.XXX.XXX-XX
    const cpfText = `${cleanedText.slice(0, 3)}.${cleanedText.slice(3, 6)}.${cleanedText.slice(6, 9)}-${cleanedText.slice(9, 11)}`

    return new Cpf(cpfText)
  }
}
