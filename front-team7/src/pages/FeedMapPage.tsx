import { FeedHeader } from '@/components/FeedHeader';
import { Main } from '@/components/Layout';
import Map from '@/components/Map/Map';
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { mapAtom } from '@/store/map';
import ModalFrame from '@/components/Layout/ModalFrame/ModalFrame';
import FeedDetail from '@/components/Layout/FeedDetail/FeedDetail';
import { feedModalAtom } from '@/store/feedModal';
import * as Api from '@/api/feeds';
import Form from '@/components/Form/Form';
import { userIdState } from '@/store';
import queryString from 'query-string';


enum ModalState {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  FEED = 'FEED',
  work = '일하는중'
};

interface CenterLatLng {
  lat: number;
  lng: number;
}

interface Review {
  userName: string;
  contents: string;
  timestamp: Date;
}

interface FeedProps {
  _id: string;
  userName: string;
  title: string;
  description: string;
  imageUrl: Array<string>;
  review: Array<Review>;
  address: string;
  location: CenterLatLng;
  createdAt: string;
  updatedAt: string;
}

interface FeedDetail {
  userName: string;
  title: string;
  description: string;
  review: Array<Review>;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface FeedListProps extends Array<FeedProps> { }

const FeedMapPage = () => {
  const { userId } = useParams();
  const [feedList, setFeedList] = useState<FeedListProps>([]);
  const [_mapValue, setMapValue] = useRecoilState(mapAtom);
  const [stateModal, setStateModal] = useState(false);
  const [modalChildrenState, setModalChildrenState] = useState('');
  const userIdAtom = useRecoilValue(userIdState);
  const [feedModalState, setFeedModalState] = useRecoilState(feedModalAtom);
  const feedIdQueryString = queryString.parse(window.location.search);

  useEffect(() => {
    // userId를 사용한 API Call -> feedList를 useState로 관리
    async function getFeedList() {
      const result = await Api.getUserFeedList(userId);

      setFeedList(result);

      if (Object.keys(feedIdQueryString).length > 0) {
        setMapValue((currMapValue) => ({
          ...currMapValue,
          centerLatLng: {
            lat: Number(feedIdQueryString.lat),
            lng: Number(feedIdQueryString.lng),
          },
        }));
      } else if (result.length > 0) {
        setMapValue((currMapValue) => ({
          ...currMapValue,
          centerLatLng: {
            lat: result[0].location.lat,
            lng: result[0].location.lng,
          },
        }));
      }
    }



    getFeedList();
  }, []);

  const onClickModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    setModalChildrenState(ModalState.CREATE);
    toggleModal();
  };

  const onClickMapFeed = (item: FeedProps) => {
    const { userName, title, description, address, location, review, createdAt } = item;
    changeCenterLatLng(location);
    setFeedModalState((prev) => ({
      ...prev,
      userName,
      title,
      description,
      address,
      review,
      createdAt,
    }));
    setModalChildrenState(ModalState.FEED);
    toggleModal();
  };

  const changeCenterLatLng = (newCenterLatLng: CenterLatLng) => {
    setMapValue((currMapValue) => ({
      ...currMapValue,
      centerLatLng: {
        lat: newCenterLatLng.lat,
        lng: newCenterLatLng.lng,
      },
      mapLevel: 1,
    }));
  };

  const toggleModal = () => {
    setStateModal((prev) => !prev);
  };

  const switchModalChildrenState = (modalChildrenState: string) => {
    switch (modalChildrenState) {
      case 'CREATE':
        return <Form />;
      case 'EDIT':
        return; //<EditForm/>;
      case 'FEED':
        return <FeedDetail
          isModal={true}
          name={feedModalState.userName}
          title={feedModalState.title}
          desc={feedModalState.description}
        />;
    }
  };

  const onClickEditFeedModal = (item: FeedProps) => {
    console.log(item);

  };

  const onClickDeleteFeed = async (feedId: string) => {

    if (!window.confirm('피드를 정말로 삭제하시겠습니까 ?')) return;

    const result = await Api.deleteOneFeed(feedId);

    if (result.result === 'success') alert('피드가 삭제되었습니다.'); // re-rendering 구현

  };



  return (
    <Main>
      <StyledWrapper>
        <Map feedList={feedList} toggleModal={onClickMapFeed}></Map>
        {/* <StyleUserInfoContainer>
          <UserInfo name={currentUser?.name || ''} image={currentUser?.profileImage ? currentUser.profileImage[0] : unknownUser}></UserInfo>
        </StyleUserInfoContainer> */}
        {(userIdAtom === userId) &&
          <Button onClick={onClickModal}>
            <BsPlus />
          </Button>
        }
        <StyledFeeds>
          {feedList?.map((item, idx) => (
            <FeedHeader
              onClickFeedModal={() => onClickMapFeed(item)}
              onClickEditFeedModal={() => onClickEditFeedModal(item)}
              onClickDeleteFeed={() => onClickDeleteFeed(item._id)}
              isFolded={true}
              isUser={userIdAtom === userId}
              key={idx}
              feedId={item._id}
              name={item.userName}
              title={item.title}
            />
          ))}
        </StyledFeeds>
      </StyledWrapper>
      <ModalFrame handleModal={toggleModal} state={stateModal}>
        {switchModalChildrenState(modalChildrenState)}
      </ModalFrame>
    </Main>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  position: absolute;
  z-index: 4;
  bottom: 160px;
  right: 5%;
  font-size: 4.5rem;
  width: 56px;
  height: 56px;
  border: none;
  background-color: #00cec9;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;

  @media only screen and (min-width: 768px) {
    bottom: 5%;
    width: 70px;
    height: 70px;
    font-size: 7rem;
  }

  @media only screen and (min-width: 1024px) {
    bottom: 5%;
    width: 80px;
    height: 80px;
    font-size: 8rem;
  }
`;

const StyledFeeds = styled.div`
  position: absolute;
  max-height: 160px;
  width: 90%;
  z-index: 3;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  gap: 5px;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  @media only screen and (min-width: 768px) {
    width: 350px;
    height: 100%;
    max-height: 68%;
    right: 2%;
    top: 2%;
  }

  @media only screen and (min-width: 1024px) {
    width: 400px;
  }
`;

// const StyleUserInfoContainer = styled.div`
//   position: absolute;
//   z-index: 3;
//   background-color: white;
//   padding: 10px 15px;
//   border-radius: 20px;
//   top: 5%;
//   left: 5%;
// `;

export default FeedMapPage;
