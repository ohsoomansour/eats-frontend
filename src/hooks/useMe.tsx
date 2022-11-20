import { useQuery, gql } from "@apollo/client"
import { MeQuery } from "../__generated__/types"
/*#️⃣15.18 
  1. applo는 me query의 캐시가 있다는 것을 안다 > 따라서 query hooks를 사용해도 좋음
    > if없다면 graphql, apollo가 알아서 가져와 준다
    

 🔹RequestMethod: OPTIONS 📄https://jaeyeong951.medium.com/options-%EC%9A%94%EC%B2%AD%EC%9D%80-%EC%B2%98%EC%9D%8C-%EB%B3%B4%EB%8A%94%EB%8D%B0%EC%9A%94-sop-cors-398f780601bb
  - Preflight request 요청시 필요  
  - OPTIONS는 서버에서 추가 정보를 판별하는데 사용하는 HTTP/1.1 메서드이며, safe 메서드이기 때문에 
     리소스를 변경하는데 사용 할 수 없다 


  🔹origin: protocol(scheme), host(domain name), port가 일치 할 경우    
  🔹SOP( Same-origin policy): SOP란 같은 origin으로만 요청을 주고 받을 수 있다는 뜻      
  🔹Cross-Origin-Resource-Sharing:    
 */


export const ME_QUERY = gql`
  query me{
    me {
      id
      email
      role
      verified
    }
  }
`


export const useMe = () => {
  return useQuery<MeQuery>(ME_QUERY)
}