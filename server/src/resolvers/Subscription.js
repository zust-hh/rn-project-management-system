function newProjectSubscribe(parent, args, context, info) {
    return context.prisma.$subscribe.project({ mutation_in: ['CREATED'] }).node()
}

function updateProjectSubscribe(parent, args, context, info) {
    return context.prisma.$subscribe.project({ mutation_in: ['UPDATED'] }).node()
}

function updateUserSubscribe(parent, args, context, info) {
    return context.prisma.$subscribe.user({ mutation_in: ['UPDATED'] }).node()
}

const newProject = {
    subscribe: newProjectSubscribe,
    resolve: payload => {
        return payload
    },
}

const updateProject = {
    subscribe: updateProjectSubscribe,
    resolve: payload => {
        return payload
    },
}

const updateUser = {
    subscribe: updateUserSubscribe,
    resolve: payload => {
        return payload
    },
}

module.exports = {
    newProject,
    updateProject,
    updateUser,
}