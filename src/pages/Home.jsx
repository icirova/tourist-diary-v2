import "./Home.css"
import Card from "../components/Card"
import data from "../data"


const Home = () => {
    return <div className="cards">
    {
        data.map ( (oneCard) => {
            const {id, title, tags, perex} = oneCard
                
            return(    
                <Card key={id} id={id} title={title} tags={tags} perex={perex}></Card>     
            )
        })
    }
</div>
  }
  
  export default Home