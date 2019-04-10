name = (parent, args, context) => {
    return context.prisma.project({ id: parent.id }).name()
}

module.exports = {
    name,
}