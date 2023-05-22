import React from "react"
import { useSession, signOut, getSession } from "next-auth/react"
import { google } from "googleapis"
import { youApi, API_KEY } from '@/app/utils/youApi'

export async function GET(request) {

  const videoData = {
        video: {
          id:     "",
          categoryId:   "",
          tittle: ""
        }
  };

  changeTitle("xN2V7TjlvtU", "New Title");

  

  return new Response("result");
  
}

export const changeTitle = async (videoId, newTitle) => {
  const { user } = await useSession();

  if (!user) {
    return;
  }

  const youtube = google.youtube({
    version: "v3",
    auth: user.accessToken,
  });

  const request = youtube.videos().update({
    part: "snippet",
    body: {
      snippet: {
        title: newTitle,
      },
    },
    id: videoId,
  });

  const response = await request.execute();

  if (response.error) {
    console.error(response.error);
    return false;
  } else {
    console.log("Title updated!");
    return true;
  }

};
