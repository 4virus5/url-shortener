import { useState } from "react"

export const Home = ()=>{
    const [stats,setStats] = useState(null)
    const [longUrl,setLongUrl] = useState("")
    const [shortUrl,setShortUrl] = useState("")

    const fetchStats = async ()=>{
        try{
            const code = shortUrl.split('/').pop()
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/stats/${code}`)
            const data = await response.json()
            setStats(data)
        }catch(error){
            console.log("Error: ",error)
            alert("Something went Wrong")
        }
    }

    const shortneUrl = async ()=>{
        try{    
            const respone = await fetch(
                `${import.meta.env.VITE_API_URL || ''}/api/url/shorten`,
                {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        originalUrl:longUrl
                    })
                }
            )
            const data = await respone.json()
            setShortUrl(data.shortUrl)

        }catch(error){
            console.log("Error: ",error)
            alert("Something went Wrong")
        }
    }
    return (
        <div style={{padding:'50px',textAlign:'center'}} >
            <h1>URL Shortner</h1>
            <input  style={{padding:'10px'}} type="text"
            placeholder="Enter Long URL"
            value={longUrl}
            onChange={(e)=>setLongUrl(e.target.value)}
            />

            <br />
            <br />

            <button onClick={shortneUrl} >Shorten URL</button>

            {
                shortUrl && (
                    <>
                    <p>Short Url: <a href={shortUrl} target="blank" >{shortUrl}</a></p>
                    <button onClick={fetchStats} >View Stats</button>
                    </>
                )
            }
            {stats && (
            <div style={{ marginTop: "20px" }}>
                <h3>Analytics</h3>
                <p>Original URL: {stats.originalUrl}</p>
                <p>Total Clicks: {stats.clicks}</p>
            </div>
        )}

        </div>
    )
}