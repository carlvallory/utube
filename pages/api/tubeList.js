import React from "react"
import { useSession, signOut, getSession } from "next-auth/react"
import { google } from "googleapis"

export default async (req, res) => {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

  const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
  const channelResponse = await fetch(NEXTAUTH_URL+"/api/tubeChannel");
  const channelResponseJson = await channelResponse.json();
  
  const { uploads } = channelResponseJson.relatedPlaylists;

  const URL = "https://www.googleapis.com/youtube/v3/playlistItems?playlistId="+uploads+"&part=snippet,id&chart=mostPopular&key="+API_KEY;

  const response = await fetch(URL);
  const responseJson = await response.json();

  //const { videoId, videoOwnerChannelId } = responseJson.items[0].snippet.resourseId;

  return res.status(200).json(responseJson);

    if(responseJson.items){
        responseJson.items.forEach((currentElement, index, array) => {
          if(index == 0){
              const { channelId, title, description } = responseJson.items[index].snippet;
              const { videoId } = responseJson.items[index].snippet.resourceId;
              return res.status(200).json({videoId});
          }
        });

        return res.status(404).json({error: "not found"});
    } else {
        res.status(500).json({ error: responseJson });
    }
}
