addBy = (parent, args, context) => {
    return context.prisma.project({ id: parent.id }).addBy()
}

tutor = (parent, args, context) => {
    return context.prisma.project({ id: parent.id }).tutor()
}

steps = (parent, args, context) => {
    return context.prisma.project({ id: parent.id }).steps()
}

member = (parent, args, context) => {
    return context.prisma.project({ id: parent.id }).member()
}

favoriteUser = (parent, args, context) => {
    return context.prisma.project({ id: parent.id }).favoriteUser()
}

module.exports = {
    addBy,
    tutor,
    steps,
    member,
    favoriteUser
}