import * as NoteService from "../services/notes.services";
import * as NoteValidate from "../schemas/notes.schema";

async function getAllNotes(req, res) {
  try {
    const userId = req.user.id;
    const notes = await NoteService.getAllNotes(userId);
    res.json({ status: true, data: notes });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
      res.json({ status: false, message: error.message });
    }
  }
}

async function getSingleNote(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    if (!postId) throw new Error("Can Not get this post!");
    const note = await NoteService.getSingleNoteById(postId, userId);

    res.json({ status: true, data: note });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
      res.json({ status: false, message: error.message });
    }
  }
}

async function addSingleNote(req, res) {
  try {
    const userId = req.user.id;
    const postData = NoteValidate.parsePostData(req.body);
    if (!postData.success) throw new Error("Invalid Data");

    const data = {
      description: postData.data.description,
      tag: postData.data.tag,
      title: postData.data.title,
      userId: userId,
    };

    const note = await NoteService.createNote(data);
    res.json({ status: true, data: note });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
      res.json({ status: false, message: error.message });
    }
  }
}

async function updateSingleNote(req, res) {
  try {
    const userId = req.user.id;
    const postData = NoteValidate.parsePostData(req.body);
    if (!postData.success) throw new Error("Invalid Data");

    const postId = req.params.id;
    if (!postId) throw new Error("Can Not update this post!");

    const note = await await NoteService.getSingleNoteById(postId, userId);
    console.table(note);
    if (!note) throw new Error("Note not found");
    if (note.userId !== userId) throw new Error("You do not own this Note!!");

    const data = {
      description: postData.data.description,
      tag: postData.data.tag,
      title: postData.data.title,
      userId: userId,
    };

    const updatedNote = await NoteService.updateSingleNoteById(postId, data);

    res.json({ status: true, data: updatedNote });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
      res.json({ status: false, message: error.message });
    }
  }
}

async function deleteSingleNote(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    if (!postId) throw new Error("Can Not delete this post!");

    const note = await NoteService.getSingleNoteById(postId, userId);
    if (!note) throw new Error("Note not found");
    if (note.userId !== userId) throw new Error("You do not own this Note!!");

    const updatedNote = await NoteService.deleteSingleNoteById(postId);
    res.json({ status: true, data: updatedNote });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
      res.json({ status: false, message: error.message });
    }
  }
}

async function shareNote(req, res) {
  try {
    const userId = req.user.id;
    const sharedPostData = NoteValidate.parseSharedPostData(req.body);
    if (!sharedPostData.success) throw new Error("Invalid Data");

    const note = await NoteService.getSingleNoteById(
      sharedPostData.data.postId,
      userId
    );
    if (!note) throw new Error("Note not found");
    if (note.userId !== userId) throw new Error("You do not own this Note!!");

    const user = await NoteService.getUserToSharedWith(
      sharedPostData.data.username
    );
    if (!user) throw new Error("No User Found!!");
    if (user.id === userId) throw new Error("Can not share with yourself!!");

    const sharedNote = await NoteService.createSharedNote({
      accessId: user.id,
      postId: sharedPostData.data.postId,
      username: sharedPostData.data.username,
    });

    res.json({ status: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
      res.json({ status: false, message: error.message });
    }
  }
}

async function getPostsSharedWithMe(req, res) {
  try {
    const userId = req.user.id;
    const response = await NoteService.getIdsSharedWithMe({ accessId: userId });

    if (response.length == 0) {
      return res.json({ status: true, data: [] });
    }
    const idsOfSharedPosts = response.map((e) => e.postId);
    if (idsOfSharedPosts.length > 0) {
      const data = await NoteService.getPostsSharedWithMe({
        ids: idsOfSharedPosts,
      });
      return res.json({ status: true, data });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
      res.json({ status: false, message: error.message });
    }
  }
}
async function unshareNote(req, res) {
  try {
    const userId = req.user.id;
    const sharedPostData = NoteValidate.parseSharedPostData(req.body);
    if (!sharedPostData.success) throw new Error("Invalid Data");

    const user = await NoteService.getUserToSharedWith(
      sharedPostData.data.username
    );
    if (!user) throw new Error("No user Found!");

    const sharedPost = await NoteService.getSharedPostByIdAndAccessorId({
      accessId: user.id,
      postId: sharedPostData.data.postId,
    });
    if (!sharedPost) throw new Error("Note not shared with the user");

    const repsonse = await NoteService.deleteSharedPostByIdAndAccessorId({
      accessId: user.id,
      postId: sharedPostData.data.postId,
    });
    res.json({
      status: true,
      data: { message: "Post unshared sucessfully!!" },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
      res.json({ status: false, message: error.message });
    }
  }
}

async function sharedNoteInfo(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.body.postId;

    const note = await NoteService.getSingleNoteById(postId, userId);
    if (!note) throw new Error("Note not found");
    if (note.userId !== userId) throw new Error("You do not own this Note!!");

    const usersHavingAccessToPost = await NoteService.getUsersPostisSharedWith({
      postId,
    });
    return res.json({ status: true, data: usersHavingAccessToPost });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
      res.json({ status: false, message: error.message });
    }
  }
}
export {
  getAllNotes,
  getSingleNote,
  addSingleNote,
  updateSingleNote,
  deleteSingleNote,
  shareNote,
  getPostsSharedWithMe,
  unshareNote,
  sharedNoteInfo,
};
