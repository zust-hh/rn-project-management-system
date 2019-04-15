charge = (parent, args, context) => {
    return context.prisma.step({ id: parent.id }).charge()
}

module.exports = {
    charge
}