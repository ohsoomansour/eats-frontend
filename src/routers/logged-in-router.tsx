/*#️⃣15.15 Using the Token
  1. me resolver를 backend에서 호출할 경우 
     > 발생:🚨Error: Forbidden resource
     > 왜 Error가 발생하나 ? 🚧token이 없어서 그렇다!🚧 
     > Playground에서 me 리졸버 해보면 🚨error: "Forbidden resource"가 나옴 

 2. css상식
   🔹%: 부모 기준으로 몇 % , 부모의 px가 없으면 body > 상위태그 ...
    - tailwind css: h-full (단점: 부모를 찾아서 그 기준으로 100%)
   🔹vh: viewport height 화면이 800px * 1000px 이면 1vh = 10px     
    - tailwind css: h-screen 화면 기준으로  
  #️⃣15.16 Router and 404s
   1. switch가 가질 수 있는 child는 route 밖에 없다  
   2. Redirect 컴포넌트는 react-router-dom에서 제공 됨 

*/
/*#️⃣19.6 Category
  1. Location vs history
    🔷Location: 내가 어디 위치에 있는지 알려준다 
    🔷history는 어디론가 가게 만듬  
*/

/*#️⃣22.0 Order Dahboard Routes
  1. 🚧clientRoutes & commonRoutesRender 렌더 문제 🚧
    🔑피드백: const component = () => <div> Hi </div>
              if(type) component 와 같은 코드를 작성 한 것❗ 
              ⭐jsx 파서가 어떻게 element들과 컴포넌트를 파싱하는지
              
   🔷jsx문법 및 파서: 📃https://goddaehee.tistory.com/296
                      📃https://v5.reactrouter.com/web/example/route-config                  
                        
     🔹jsx: Javascript + XML, 리액트로 프로젝트를 개발할 때 사용됨(JS 문범은 아님)
      jsx element는 React.createElement(component, props, ...children)를 호출하기 위한 문법 설탕 
  🔆jsx예시) function App() {
                return(
                  <h1>Hello, SM </h1>
                )
              }

  🔆babel이 JS로 해석 예시)
      function App() {
          return React.createElement('h1',null , "Hello, SM")
      }       
    

*/
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Header } from "../components/header";
import { Restaurant } from "../pages/client/restaurant";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Category } from "../pages/client/category";
import { Restaurants } from "../pages/client/restaurants";
import { Search } from "../pages/client/search";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { AddRestaurant } from "../pages/owner/add-restaurants";
import { Myrestaurant } from "../pages/owner/my-restaurant";
import { AddDish } from "../pages/owner/add-dish";
import { Order } from "../pages/order";
import { Dashboard } from "../pages/driver/dashboard";
import { UserRole } from "../__generated__/types";

const clientRoutes = [
  {
    path: "/",
    component: <Restaurants />
  },
  {
    path: "/search",
    component: <Search /> 
  },
  {
    path: "/category/:slug",
    component: <Category /> ,
  },
  {
    path: "/restaurants/:id",
    component: <Restaurant /> 
  }
];

const commonRoutes = [
  {path: "/confirm", component: <ConfirmEmail />},
  {path: "/edit-profile", component: <EditProfile /> },
  {path: "/orders/:id", component: <Order /> }
]

const restaurantRoutes = [
  {path: "/", component: <MyRestaurants /> },
  {path: "/add-restaurant", component: <AddRestaurant />},
  {path: "/restaurants/:id", component: <Myrestaurant />},
  {path: "/restaurants/:restaurantId/add-dish", component: <AddDish />},
  
]
const driverRoutes = [
  {path:"/", component:<Dashboard />}

]

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe()  

  if(!data || loading || error){
    return (
      <div className=" h-screen flex items-center justify-center"> 
        <span className=" font-medium text-lg tracking-wide">Loding...</span>
      </div>
    )
  }
  return (
  
    <BrowserRouter>
      <Header  /> 
      <Switch>
          
        {data.me.role === UserRole.Client && 
          clientRoutes.map((route, index) => (
            <Route key={route.path} exact path={route.path} >
              {route.component} 
            </Route>
          ))}

        {data.me.role === UserRole.Owner &&
          restaurantRoutes.map((route) => (
            <Route key={route.path} exact path={route.path} >
              {route.component}
             </Route>
          ))}
        {data.me.role === UserRole.Delivery && 
          driverRoutes.map((route) => (
            <Route key={route.path} exact path={route.path} >
              {route.component}
            </Route>
      
        ))}  

        {commonRoutes.map((route) => (
            <Route key={route.path} path={route.path}>
              {route.component}
            </Route>
        ))}
  
        <Route>
          <NotFound />
        </Route>   
          
      </Switch>
    </BrowserRouter>
    
  )
}