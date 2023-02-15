import { prisma } from "../db/index";

async function getAllNotes(userId) {
  const notes = await prisma.post.findMany({ where: { userId } });
  return notes;
}

async function getSingleNoteById(id, userId) {
  const note = await prisma.post.findFirst({
    where: { AND: [{ id }, { userId }] },
  });
  if (note) return note;

  const sharedNoteId = await prisma.sharedPost.findFirst({
    where: {
      postId: id,
      accessId: userId,
    },
  });
  const sharedNote = await prisma.post.findFirst({
    where: { id },
  });
  return sharedNote;
}

async function createNote(data) {
  const note = await prisma.post.create({
    data,
  });
  return note;
}

async function updateSingleNoteById(id, NoteData) {
  const note = await prisma.post.update({
    data: NoteData,
    where: { id },
  });
  return note;
}

async function deleteSingleNoteById(id) {
  const note = await prisma.post.delete({ where: { id } });
}
async function getUserToSharedWith(username) {
  const user = await prisma.user.findUnique({ where: { username } });
  return user;
}

async function createSharedNote({ accesser, accessId, postId }) {
  const note = await prisma.sharedPost.create({
    data: {
      accesser,
      accessId,
      postId,
    },
  });
}

async function getIdsSharedWithMe({ accessId }) {
  const response = await prisma.sharedPost.findMany({
    where: {
      accessId,
    },
  });
  return response;
}

async function getSharedPostByIdAndAccessorId({ accessId, postId }) {
  const response = await prisma.sharedPost.findMany({
    where: {
      accessId,
      postId,
    },
  });
  return response;
}
async function deleteSharedPostByIdAndAccessorId({ accessId, postId }) {
  const response = await prisma.sharedPost.delete({
    where: {
      accessId_postId: {
        accessId,
        postId,
      },
    },
  });
  return response;
}

async function getPostsSharedWithMe({ ids }) {
  const data = await prisma.post.findMany({
    where: {
      id: { in: ids },
    },
  });

  return data;
}

export {
  createNote,
  deleteSingleNoteById,
  getAllNotes,
  getSingleNoteById,
  updateSingleNoteById,
  getUserToSharedWith,
  createSharedNote,
  getPostsSharedWithMe,
  getIdsSharedWithMe,
  getSharedPostByIdAndAccessorId,
  deleteSharedPostByIdAndAccessorId,
};
