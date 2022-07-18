import { Main } from '@/components/Layout';
import styled from 'styled-components';
import FeedDetail from '@/components/Layout/FeedDetail/FeedDetail';
import unknownUser from '@/assets/images/unknown-user.png';
import * as Api from '@/api/feeds';
import * as UserApi from '@/api/users';
// import { UserInfoProps } from '@/components/UserInfo';
import { useEffect, useState, CSSProperties } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '@/components/Loading/Loading';
import { axios } from '@/lib';

const StyledFeedListContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 50px 0;

  // .grid-group {
  //   display: grid;
  //   grid-template-columns: 1fr;
  //   row-gap: 30px;
  //   // column-gap: 30px;
  //   @media only screen and (min-width: 1024px) {
  //     // display: grid;
  //     grid-template-columns: repeat(2, 1fr);
  //     row-gap: 30px;
  //     column-gap: 30px;
  //   }

  //   .grid-item {
  //     margin-bottom: 30px;
  //   }
  // }
`;

interface CenterLatLng {
  lat: number;
  lng: number;
}

interface FeedProps {
  _id: string;
  userName: string;
  userId: string;
  title: string;
  imageUrl: Array<string>;
  description: string;
  address: string;
  location: CenterLatLng;
  createdAt: string;
}

interface FeedListProps extends Array<FeedProps> {}

const HomePage = () => {
  const [feedList, setFeedList] = useState<FeedListProps>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [myUserId, setMyUserId] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(3);
  const [totalPage, setTotalPage] = useState<number>(0);

  useEffect(() => {
    async function get() {
      const result = await axios.get('/api/feeds/page/list', {
        params: {
          page: page,
          perPage: perPage,
        },
      });
      const initialList = result.feedList;
      const totalPage = result.totalPage;

      setTotalPage(totalPage);
      setPage((page) => page + 1);

      setFeedList(initialList);
    }

    async function getMyUserId() {
      const myInfo = await UserApi.getMyUserInfo();
      setMyUserId(myInfo._id);
    }

    get();
    getMyUserId();
  }, []);

  const fetchMoreData = () => {
    // fetchMoreData 함수가 처음 한번밖에 실행이 안됨...

    // alert('?');
    // console.log('hasMore : ', hasMore);
    // console.log('typeof page, perPage, totalPage', typeof page, typeof perPage, typeof totalPage);
    // console.log('fetchMoreData : page, perPage, totalPage : ', page, perPage, totalPage);

    if (page > totalPage) {
      setHasMore(false);
      return;
    }

    setTimeout(async () => {
      const newItems = await axios.get('/api/feeds/page/list', {
        params: {
          page: page,
          perPage: perPage,
        },
      });
      setPage((page) => page + 1);

      // console.log('지금까지 존재하는 전체 리스트들 : ', feedList);
      // console.log('이번에 가져온 리스트들 : ', newItems.feedList);
      const newFeedList = feedList.concat(newItems.feedList);

      // console.log('합친 리스트들 : ', newFeedList);
      setFeedList(newFeedList);
    }, 1000);
  };

  return (
    <Main
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      padding={'70px 0'}
      id="main-styled"
    >
      <StyledFeedListContainer>
        <InfiniteScroll
          style={{ overflow: 'visibility' }}
          dataLength={perPage}
          next={fetchMoreData}
          hasMore={hasMore}
          endMessage={<Loading text={'모든 데이터 로드 완료!'}></Loading>}
          loader={<Loading text={'Loading...'}></Loading>}
          scrollableTarget="main-styled"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {feedList?.map((feed, index) => (
              <FeedDetail
                isModal={false}
                key={`${feed.title}-${index}`}
                name={feed.userName}
                userId={myUserId}
                feedId={feed._id}
                feedLocation={feed.location}
                feedUser={feed.userId}
                feedImg={feed.imageUrl}
                image={unknownUser as string}
                title={feed.title}
                desc={feed.description}
              ></FeedDetail>
            ))}
          </div>
        </InfiniteScroll>
      </StyledFeedListContainer>
    </Main>
  );
};

export default HomePage;
