import "./Home.css"
import Card from "../components/Card"
import data from "../data"
import CardForm from "../components/CardForm"


const Home = () => {



    return <div className="container">

        <CardForm />
        <div className="cards">
       
        {
            data.map ( (oneCard) => {
                const {id, title, tags, perex} = oneCard
                    
                return(    
                    <Card key={id} id={id} title={title} tags={tags} perex={perex}></Card>     
                )
            })
        }
        </div>
        </div>
  }
  
  export default Home