addBy = (parent, args, context) => {
    return context.prisma.message({ id: parent.id }).addBy()
}

unread = (parent, args, context) => {
    return context.prisma.message({ id: parent.id }).unread()
}

read = (parent, args, context) => {
    return context.prisma.message({ id: parent.id }).read()
}

module.exports = {
    addBy,
    unread,
    read
}