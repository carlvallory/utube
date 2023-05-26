import React from "react"
import { useSession, signOut, getSession } from "next-auth/react"
import { google } from "googleapis"

export default async (req, res) => {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID
  const URL = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=" + CHANNEL_ID + "&key=" + API_KEY;

  const response = await fetch(URL);
  const responseJson = await response.json();

    if(responseJson.items){
        responseJson.items.forEach((currentElement, index, array) => {
          if(index == 0){
              const { relatedPlaylists } = responseJson.items[index].contentDetails;
              return res.status(200).json({relatedPlaylists});
          }
        });

        return res.status(404).json({error: "not found"});
    } else {
        res.status(500).json({ error: responseJson });
    }
}
