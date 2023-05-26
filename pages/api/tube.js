import React from "react"
import { useSession, signOut, getSession } from "next-auth/react"
import { google } from "googleapis"

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { token, user } = session;

  if (req.method === 'GET') {
    // Get the new title from the request query
    const { videoId, newTitle } = req.query;
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const URL = "https://www.googleapis.com/youtube/v3/videos?part=snippet&part=id&key="+API_KEY;

    try {
      // Make a request to the YouTube API to update the video title

      const URI_REDIRECT = "api/auth/callback/google";
      const GOOGLE_REDIRECT_URL = process.env.NEXTAUTH_URL + "/" + URI_REDIRECT;
      
      const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URL,
      );

      const scopes = [
        'https://www.googleapis.com/auth/youtube.force-ssl'
      ];

      const authUrl = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
      
        // If you only need one scope you can pass it as a string
        scope: scopes
      });

      
      // const {tokens} = await oauth2Client.getToken(code)
      // oauth2Client.setCredentials(tokens);

      // oauth2Client.on('tokens', (tokens) => {
      //   if (tokens.refresh_token) {
      //     // store the refresh_token in my database!
      //     console.log(tokens.refresh_token);
      //   }
      //   console.log(tokens.access_token);
      // });

      console.log(token.user.refreshToken);

      auth.setCredentials({
        access_token: session.accessToken,
      });

      // const response = await fetch(
      //   URL,
      //   {
      //     method: 'PUT',
      //     headers: {
      //       Authorization: `Bearer ${session.accessToken}`,
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       id: videoId,
      //       snippet: {
      //         title: newTitle,
      //         categoryId: "1"
      //       },
      //     }),
      //   }
      // );

      const youtube = google.youtube({
        version: 'v3',
        auth,
      });

      var resource = {
        part: 'snippet',
        requestBody: {
          id: videoId,
          snippet: {
            title: newTitle,
            categoryId: "1"
          },
        },
      };
  

      const youtubeResponse = await youtube.videos.update(resource);


      console.log(youtubeResponse);

      // return res.status(200).json(youtubeResponse);

      if (response.ok) {
        res.status(200).json({ success: true });
      } else {
        const data = await response.json();
        res.status(response.status).json({ error: data.error });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
