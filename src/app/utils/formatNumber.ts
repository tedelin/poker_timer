function formatNumber(num: number) {
  return new Intl.NumberFormat('fr-FR').format(num)
}

export default formatNumber
