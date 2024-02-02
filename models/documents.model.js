
export async function createDocument({ title, introduction, userId }) {
    return prisma.document.create({
        data: {
            title,
            introduction,
            status: 'APPLY', // Default status
            user: {
                connect: {
                    id: userId,
                },
            },
        },
    });
}
export async function getDocuments({ orderKey, orderValue }) {
    return prisma.document.findMany({
        orderBy: {
            [orderKey]: orderValue.toLowerCase() === 'asc' ? 'asc' : 'desc',
        },
        include: {
            user: true,
        },
    });
}
export async function getDocumentById(documentId) {
    return prisma.document.findUnique({
        where: {
            id: documentId,
        },
        include: {
            user: true,
        },
    });
}
export async function updateDocument({ documentId, title, introduction, status }) {
    return prisma.document.update({
        where: {
            id: documentId,
        },
        data: {
            title,
            introduction,
            status,
        },
    });
}
export async function deleteDocument(documentId) {
    return prisma.document.delete({
        where: {
            id: documentId,
        },
    });
}
