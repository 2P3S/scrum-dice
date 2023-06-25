import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSocket from '@/hooks/useSocket';
import useLocalStorage from '@/hooks/useLocalStorage';

import { PlayRoom } from '@/components/templates/PlayRoom';

type JoinSuccessRes = {
  data: {
    member: Member;
    room: Room;
  };
  success: boolean;
  message: string;
};

type JoinFailureRes = {
  success: boolean;
  message: string;
};

const PokerRoom = () => {
  const socket = useSocket();
  const [isEnterSuccess, setEnterSuccess] = useState<boolean>(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [member, setMember] = useLocalStorage<Member | null>('member', null);

  const router = useRouter();
  const { id: roomId } = router.query;

  useEffect(() => {
    if (!socket) return;

    const handleFailure = (res: JoinFailureRes) => {
      setEnterSuccess(res.success);

      // member 정보가 없을 경우 비회원 로그인 페이지로 이동하기
      if (roomId && !member) router.push(`/login?id=${roomId}`);
    };

    const handleJoinSuccess = (res: JoinSuccessRes) => {
      setEnterSuccess(res.success);
      setMember(res.data.member);
      setRoom(res.data.room);
    };

    socket.on('failure', handleFailure);
    socket.on('join-success', handleJoinSuccess);

    socket.emit('join-room', {
      memberId: member?.id,
      roomId: member?.room,
    });

    return () => {
      socket.off('failure', handleFailure);
      socket.off('join-success', handleJoinSuccess);
    };
  }, [socket, roomId]);

  if (!isEnterSuccess || !room) return <div className="text-center">loading...</div>;

  return <PlayRoom room={room} />;
};

export default PokerRoom;
