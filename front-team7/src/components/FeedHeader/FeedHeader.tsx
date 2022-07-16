import styled from 'styled-components';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

import { FaMapMarkedAlt } from 'react-icons/fa';
import { UserInfo, UserInfoProps } from '@/components/UserInfo';
import { NavLink } from 'react-router-dom';

interface CenterLatLng {
  lat: number;
  lng: number;
}

export const FeedHeader = ({
  onClickHandler,
  isFolded,
  isUser,
  name,
  image,
  title,
  feedId,
  feedUser,
  feedLocation,
}: UserInfoProps & { title: string } & { feedId?: string } & { feedLocation?: CenterLatLng } & {
  feedUser?: string;
} & { isFolded: boolean } & { isUser: boolean } & { onClickHandler?: (event: any) => void }) => {
  return (
    <StyledFeedHeader isModal={isFolded}>
      <span className="user-info-container">
        <UserInfo name={name} image={image} />
      </span>
      <span className="title-container" onClick={onClickHandler}>
        {title}
      </span>
      {!isFolded ? (
        <StyleNav to={`/feedmap/${feedUser}?lat=${feedLocation?.lat}&lng=${feedLocation?.lng}`}>
          <FaMapMarkedAlt />
        </StyleNav>
      ) : (
        isUser && (
          <>
            <StyleEditIcon
              onClick={(event) => {
                console.log(feedId);
              }}
            />
            <StyleDeleteIcon
              onClick={(event) => {
                console.log(feedId);
              }}
            />
          </>
        )
      )}
    </StyledFeedHeader>
  );
};

const StyleNav = styled(NavLink)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 10%;
  font-size: 2.2rem;
  color: black;
`;

const StyleEditIcon = styled(AiFillEdit)`
  font-size: 1.8rem;
`;

const StyleDeleteIcon = styled(AiFillDelete)`
  font-size: 1.8rem;
`;

const StyledFeedHeader = styled.div<{ isModal: boolean }>`
  display: flex;
  height: 60px;
  align-items: center;
  gap: 8px;
  // min-height: 60px;
  padding: 20px 10px;
  border: 1px solid rgba(0, 0, 0, 15%);

  ${(props) => (props.isModal ? 'border-radius: 10px;' : 'border-radius: 10px 10px 0 0;')}
  box-shadow: 0 0.3rem 0.4rem rgba(0, 0, 0, 25%);
  background-color: white;
  ${(props) => props.isModal && 'cursor: pointer;'}
  .user-info-container {
    width: 35%;
    word-break: break-all;
  }

  .title-container {
    width: 60%;
    font-size: 1.45rem;
    font-weight: 500;
    word-break: break-all;
  }

  /* @media only screen and (min-width: 768px) {
    min-height: 70px;
  }

  @media only screen and (min-width: 1024px) {
    min-height: 80px;
  } */
`;
