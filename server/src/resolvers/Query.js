feed = (root, args, context, info) => {
    return context.prisma.projects()
}

module.exports = {
    feed,
}