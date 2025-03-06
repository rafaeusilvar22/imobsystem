export function formattedCurrency(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

export function removeSpecialCharactersAndSpaces(text) {
  return text
    .normalize("NFD") // Decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-zA-Z0-9]/g, "") // Remover caracteres especiais e espaços
    .toLowerCase(); // Converter para minúsculas
}
