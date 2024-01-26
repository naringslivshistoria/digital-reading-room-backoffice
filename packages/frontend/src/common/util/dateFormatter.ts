export const formatDate = (aDate: any) => {
  if (!aDate) {
    return ''
  }

  const dateInstance = new Date(Date.parse(aDate as string))

  return dateInstance.toISOString().substring(0, 16).replace('T', ' ')
}
