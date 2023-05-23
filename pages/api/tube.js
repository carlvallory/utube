import React from "react"
import { useSession, signOut, getSession } from "next-auth/react"
import { google } from "googleapis"

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    // Get the new title from the request query
    const { videoId, newTitle } = req.query;
    const api_key = process.env.YOUTUBE_API_KEY;

    try {
      // Make a request to the YouTube API to update the video title
      //let auth = "Bearer " + api_key;

      let auth = `Bearer ${session.accessToken}`;
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: videoId,
            snippet: {
              title: newTitle,
            },
          }),
        }
      );

      console.log(auth);

      if (response.ok) {
        res.status(200).json({ success: true });
      } else {
        const data = await response.json();
        res.status(response.status).json({ error: data.error });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
