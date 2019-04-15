addByProjects = (parent, args, context) => {
    return context.prisma.user({ id: parent.id }).addByProjects()
}

memberProjects = (parent, args, context) => {
    return context.prisma.user({ id: parent.id }).memberProjects()
}

favorite = (parent, args, context) => {
    return context.prisma.user({ id: parent.id }).favorite()
}

message = (parent, args, context) => {
    return context.prisma.user({ id: parent.id }).message()
}

follow = (parent, args, context) => {
    return context.prisma.user({ id: parent.id }).follow()
}

tutorProjects = (parent, args, context) => {
    return context.prisma.user({ id: parent.id }).tutorProjects()
}

unreadMessage = (parent, args, context) => {
    return context.prisma.user({ id: parent.id }).unreadMessage()
}

readMessage = (parent, args, context) => {
    return context.prisma.user({ id: parent.id }).readMessage()
}

module.exports = {
    addByProjects,
    memberProjects,
    favorite,
    message,
    follow,
    tutorProjects,
    unreadMessage,
    readMessage,
}