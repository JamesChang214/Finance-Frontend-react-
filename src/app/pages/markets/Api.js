import axios from 'axios';
import catchAxiosError from '../../util/catchAxiosError';

export async function fetchTokenData() {
  console.log("Fetched Tokens")
  const result = await axios
    .get(`https://api.loop.markets/v1/tokens`,
    { headers: { Authorization: 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImRhdGEiOnsidXNlcm5hbWUiOiJhdG9tbGF1bmNoIiwiZW1haWwiOiJlcmljQGxpbDJnb29kLmNvbSIsImNyZWF0ZWRfYXQiOiIyMDIxLTA4LTI0IDA3OjU5OjQzIiwidXBkYXRlZF9hdCI6IjIwMjEtMDgtMjQgMDc6NTk6NDMiLCJpZCI6MX0sImlhdCI6MTYyOTgxNzE4M30.4H1VCotSIHHBg2yImuv3DDXDTQkZatkvp2r0rChL1es' } })
    .catch(catchAxiosError);
  return result.data;
}

export async function addToken(payload) {
  console.log(payload)
  const result = await axios
    .post(`https://api.loop.markets/v1/add/token`,
    payload,
    { headers: { Authorization: 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImRhdGEiOnsidXNlcm5hbWUiOiJhdG9tbGF1bmNoIiwiZW1haWwiOiJlcmljQGxpbDJnb29kLmNvbSIsImNyZWF0ZWRfYXQiOiIyMDIxLTA4LTI0IDA3OjU5OjQzIiwidXBkYXRlZF9hdCI6IjIwMjEtMDgtMjQgMDc6NTk6NDMiLCJpZCI6MX0sImlhdCI6MTYyOTgxNzE4M30.4H1VCotSIHHBg2yImuv3DDXDTQkZatkvp2r0rChL1es' } })
    .catch(catchAxiosError);
  return result.data;
}

export async function removeToken(payload) {
  console.log(payload)
  const result = await axios
    .post(`https://api.loop.markets/v1/delete/token`,
    payload,
    { headers: { Authorization: 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImRhdGEiOnsidXNlcm5hbWUiOiJhdG9tbGF1bmNoIiwiZW1haWwiOiJlcmljQGxpbDJnb29kLmNvbSIsImNyZWF0ZWRfYXQiOiIyMDIxLTA4LTI0IDA3OjU5OjQzIiwidXBkYXRlZF9hdCI6IjIwMjEtMDgtMjQgMDc6NTk6NDMiLCJpZCI6MX0sImlhdCI6MTYyOTgxNzE4M30.4H1VCotSIHHBg2yImuv3DDXDTQkZatkvp2r0rChL1es' } })
    .catch(catchAxiosError);
  return result.data;
}
