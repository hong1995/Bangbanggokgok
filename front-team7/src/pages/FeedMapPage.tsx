import { FeedHeader } from "@/components/FeedHeader";
import { Main } from "@/components/Layout";
import Map from "@/components/Map/Map";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { mapAtom } from "@/store/map";
import ModalFrame from "@/components/Layout/ModalFrame/ModalFrame";
import FeedDetail from "@/components/Layout/FeedDetail/FeedDetail";

interface CenterLatLng {
  lat: number;
  lng: number;
}

interface FeedProps {
  username: string;
  title: string;
  description: string;
  address: string;
  location: CenterLatLng;
}


interface FeedListProps extends Array<FeedProps> { }

const FeedMapPage = () => {
  const { userId } = useParams();
  const [feedList, setFeedList] = useState<FeedListProps>([]);
  const [_, setMapValue] = useRecoilState(mapAtom);
  const [stateModal, SetStateModal] = useState(false);


  useEffect(() => {
    setFeedList([
      {
        username: '김정현',
        title: '👍🏽 카카오에 방문해봤습니다.',
        description: '카카오 본사에 들렸읍니다.',
        address: '제주 제주시 첨단로 242',
        location: {
          lat: 33.450705,
          lng: 126.570677
        }
      },
      {
        username: '김정',
        title: '근린공원이네요',
        description: '카카오 근린공원에 들렸읍니다.',
        address: '제주 제주시 첨단로 242',
        location: {
          lat: 33.451393,
          lng: 126.570738
        }
      },
      {
        username: '제주도사람',
        title: '🌾 텃밭 방문해봤습니다.',
        description: '카카오 텃밭에 들렸읍니다.',
        address: '제주 제주시 첨단로 242',
        location: {
          lat: 33.450936,
          lng: 126.569477
        }
      },
      {
        username: '그냥아저씨',
        title: '제주도 카카오',
        description: '아저씨가 카카오에',
        address: '제주 제주시 첨단로 242',
        location: {
          lat: 33.450879,
          lng: 126.569940
        }
      },
      {
        username: '서울사람',
        title: '서울역 방문기',
        description: '서울역에 들렸읍니다.',
        address: '서울 특별시 서울역',
        location: {
          lat: 37.55294316360036,
          lng: 126.97289588774116
        }
      }
    ]);
  }, []);



  const onClickModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event);
    console.log('click');
  };

  const onClickMapFeed = (event: React.MouseEvent<HTMLButtonElement>, newCenterLatLng: CenterLatLng) => {
    changeCenterLatLng(newCenterLatLng);
    console.log(event.currentTarget);
  };

  const changeCenterLatLng = (newCenterLatLng: CenterLatLng) => {
    setMapValue((currMapValue) => ({
      ...currMapValue,
      centerLatLng: {
        lat: newCenterLatLng.lat,
        lng: newCenterLatLng.lng
      },
      mapLevel: 1
    }));
  };

  const toggleModal = () => {
    SetStateModal((prev) => !prev);
  };

  return (
    <Main>
      <StyledWrapper>
        <Map feedList={feedList} ></Map>
        <Button onClick={onClickModal}>
          <BsPlus />
        </Button>
        <StyledFeeds>
          {feedList.map((item, idx) => (
            <FeedHeader
              onClickHandler={(event: any) => onClickMapFeed(event, item.location)}
              isFolded={true}
              key={idx}
              name={item.username}
              title={item.title}
            />
          ))}
        </StyledFeeds>
      </StyledWrapper>
      <ModalFrame handleModal={toggleModal} state={stateModal}>
        {/* <FeedDetail></FeedDetail> */}
      </ModalFrame>
    </Main >
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
  bottom: 20%;
  right: 5%;
  margin-bottom: 5px;
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
`;

const StyledFeeds = styled.div`
  position: absolute;
  max-height: 27%;
  width: 90%;
  z-index: 3;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

export default FeedMapPage;