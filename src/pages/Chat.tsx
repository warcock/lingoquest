import { ChatProvider } from '../context/ChatContext';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import PageTransition from '../components/animations/PageTransition';

const Chat = () => {
  return (
    <ChatProvider>
      <PageTransition>
        <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
          <div className="bg-white rounded-lg shadow-lg h-full">
            <div className="grid grid-cols-12 h-full">
              {/* Chat list sidebar */}
              <div className="col-span-4 border-r">
                <div className="p-4 border-b">
                  <h1 className="text-xl font-bold">Messages</h1>
                </div>
                <div className="h-[calc(100%-4rem)] overflow-y-auto">
                  <ChatList />
                </div>
              </div>

              {/* Chat window */}
              <div className="col-span-8">
                <ChatWindow />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </ChatProvider>
  );
};

export default Chat; 