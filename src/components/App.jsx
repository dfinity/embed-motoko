import ReactTooltip from 'react-tooltip';
import isEmbedded from '../utils/isEmbedded';
import Embed from './Embed';

export default function App() {
  return (
    <>
      <ReactTooltip />
      {isEmbedded() ? (
        <Embed />
      ) : (
        <div className="h-screen flex flex-col bg-[#F5F5F5] justify-center items-center">
          <div>
            <h1 className="text-4xl sm:text-6xl text-center">Embed Motoko</h1>
            <hr className="my-5" />
          </div>
          <div className="w-full p-4">
            <iframe
              title="Embed Motoko"
              className="w-full h-screen mx-auto"
              style={{
                maxWidth: 640,
                maxHeight: 480,
                border: 0,
                boxShadow: '0 0 20px #CCC',
              }}
              src={window.location.href}
            />
          </div>
        </div>
      )}
    </>
  );
}
