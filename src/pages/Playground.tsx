import { PromptPanel } from '../components/playground/PromptPanel';
import { StreamingOutput } from '../components/playground/StreamingOutput';
import { useStream } from '../hooks/useStream';

const Playground = () => {
  const { state, startStream, retryStream, stopStream, clearSession } = useStream();

  return (
    <div className="flex h-[calc(100vh-65px)] w-full flex-col lg:flex-row bg-[#050505] overflow-hidden" aria-label="AI Inference Playground">

      <section className="w-full lg:w-1/3 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-[#262626]">
        <PromptPanel
          onStart={startStream}
          onStop={stopStream}
          onRetry={retryStream}
          onClear={clearSession}
          status={state.status}
        />
      </section>


      <section className="w-full lg:w-2/3 h-1/2 lg:h-full">
        <StreamingOutput state={state} />
      </section>
    </div>
  );
};

export default Playground;
