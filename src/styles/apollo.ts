
/*#️⃣14.3 Apollo Setup - 📄https://www.apollographql.com/docs/react/get-started/
  1. 백엔드 포트 4000 / 프론트 엔드 포트 3000
    > 백엔드 npm run start:dev
  2. 🚧Apollo Client Developer Tools 설치  
    🔴스키마가 안보임
*/
/*#️⃣15.0 Local Only Field
    1.의미: Your Apollo Client queries can include local-only fields 
            that aren't defined in your GraphQL server's schema:
    2. 'local state'는 서버에는 없지만 app자 하는 local state lication에는 있기를 바라는 state       
      > logout 같은게 front end에서 다루고자 함 
      > app component가 유저가 로그인 상태인지 아닌지에 대한 local state를 알아내야 함
      > ⭐유저가 로그인을 하면 local state를 업데이트 > logged-ion-router를 보여야 한다 
    3. 🔷read() : field의 값을 반환

    4. [App.tsx] - ⭐app ts파일에서 어떻게 접근하는지 
    🚧 Apollo GraphQL extension 설치 
    🚧 import { useQuery, gql } from '@apollo/client'
    🚀const IS_LOGGED_IN = gql`
        query isLoggedIn{    🚨[apollo.ts]에서 isLoggedIn과 반드시 같아야 함
          isLoggedIn @Clent  🚨@client를 붙이지 않고 그냥 쓰면 GraphQL이 서버한테 가서 이걸 요구함
          }                  🚨GraphQL operation: 🔷reactive-variable를 쓰면 쓸필요성 없어짐 
      `
     function App() {
      ✅const {data} = useQuery(IS_LOGGED_IN);
        console.log(data) 
        return (
          <LoggedOutRouter></LoggedOutRouter>
        )
     }

     export default App;  
    5. localhost:3000 [console창] 
       ▼{isLoggedIn: false}

    6. local storage에 token이 있을 경우 > 우리가 logged in 되었다는 걸 알려준다
      > read() {
        return Boolean(localstorage.getItem("token"))
      }   
    7. 🔷local only field를 업데이트하는 주체는 'LoggedOutRouter'가 되어야 한다
      7-1)
       > 📄reactive-variables: https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/#storing-local-state-in-reactive-variables 
       > [logged-out-router.ts]
         📄필드의 값이 reactive variabe에 의존 & varaible's value이 변한다면
         every active query that incldues the field(로컬필드) automatically refreshes
       > 📄You can read and modify reactive variables from anywhere in your application,
          without needing to use a GraphQL operation to do so. + 저장은 apollo client에 된다    
      7-2)      
        🚧import { makeVar } from '@apollo/client';
       🔹export const cartItemsVar = makeVar([]);  "인수에 default값 설정 해줘야 함"
         📄https://www.apollographql.com/docs/react/local-state/reactive-variables/#creating
      7-3) 섹시한 방법 > [App.tsx]
          const isLoggedIn = useReactiveVar(isLoggedVar)  
          
    8. 🔹cashing: 
        📄https://www.apollographql.com/docs/react/caching/overview (local)
        📄https://www.apollographql.com/docs/react/data/queries/   (일반query)
       🔹InMemoryCache: 
       📄https://www.apollographql.com/docs/react/caching/cache-configuration
       📄https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies
       🔹typePolices      
    */
/*#️⃣15.15 Using the Token
  1.[apollo.ts]에서 apollo client가 하는 모든 걸 변경 가능 
    📄https://www.apollographql.com/docs/react/api/link/introduction/ (Apollo Link overview)
    📄https://www.apollographql.com/docs/react/api/link/apollo-link-context/#overview  (setContext 설명)
    
    📄httpLink1: https://www.apollographql.com/docs/react/networking/authentication/ (전체적인 설명, 아래 doc와 같음)
    📄httpLink2: https://www.apollographql.com/docs/react/networking/advanced-http-networking

      import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
      import { setContext } from '@apollo/client/link/context';

      const httpLink = createHttpLink({
        uri: '/graphql',
      });

      🚀It receives two arguments: the GraphQL request being executed, and the previous context.

      const authLink = setContext((_, 🚀{ headers }) => {
        
      ⭐get the authentication token from local storage if it exists
        const token = localStorage.getItem('token');

      ⭐return 🚀the headers to the context(🚀NewContext) so httpLink(2번 링크) can read them
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
          }
        }
      });

      const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
      });
         
      🔹link: apllo httpLink에 보낸다
      🔹concat()메서드: 
        const array1 = ['a', 'b', 'c']; const array2 = ['d', 'e, 'f' ];
        const array3 = array1.concat(array2) "array1+array2 = "새로운 배열 array3을 반환 "
        강의) authLink.concat(httpLink)는 하나의 링크에 여려 링크를 추가하는 것 (여러 링크를 사용하는 법)
      🔹setContext: Apoll Link 패키지 @apollo/client/link/context 에서 온다
      🔹outgoing: IT 발신
      🔹Context: 애플리케이션 객체, 현재 상태의 맥락 "새로 생성된 객체가 지금 어떤 일이 일어나고 있는지 알 수있도록"
                 리소스, 데이터베이스에 대한 접근 허용  
        > nico: "setContext는 모든 clinet가 만든 request의 context를 set한다 "
      🔹아폴로에서 캐시: The cache is in the memory of the browser            
    */
import { createHttpLink, ApolloClient, InMemoryCache, makeVar, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { LOCALSTORAGE_TOKEN } from './constant';   
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';


const token = localStorage.getItem(LOCALSTORAGE_TOKEN);      
export const isLoggedInVar = makeVar(Boolean(token)); 
export const authTokenVar = makeVar(token);

const wsLink = new GraphQLWsLink(createClient({
  url: 
    process.env.NODE_ENV === "production"
      ? "wss://eats-backend.herokuapp.com/graphql"
      : `ws://localhost:4000/graphql`,
  
  connectionParams:{
    "x-jwt": authTokenVar() || ""
  }
})); 


const httpLink = createHttpLink({
  uri: 
    process.env.NODE_ENV === "production"
      ? "https://eats-backend.herokuapp.com/graphql"
      : 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {

  return {
    headers:{
      ...headers,
      "x-jwt":authTokenVar() || ""
    }
  }
})
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

// 캐시 <-- 상호 작용 --> local data(reactive variable & local state)
export const client = new ApolloClient({
  connectToDevTools:true,
  link: splitLink ,
  cache: new InMemoryCache({
    typePolicies:{
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            }
          },
          token:{
            read() {
              return authTokenVar()
            }
          }
        },

      }
    }
  }),
});

