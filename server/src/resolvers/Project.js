addBy = (parent, args, context) => {
    return context.prisma.project({ id: parent.id }).addBy()
}

module.exports = {
    addBy,
}