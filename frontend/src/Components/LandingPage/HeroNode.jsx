import { Handle, Position } from '@xyflow/react';

const HeroNode = ({ data }) => {
    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] border border-gray-100 min-w-[180px] overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300">

            {/* Tag bar */}
            <div className="h-9 border-b border-gray-50 px-4 flex items-center justify-between bg-gray-50/60">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#342F2F]/30 group-hover:bg-[#342F2F]/60 transition-colors" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.18em]">
                        {data.tag || 'Node'}
                    </span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-3.5 bg-white">
                {data.label}
            </div>

            {data.type !== 'input' && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="!w-2.5 !h-2.5 !bg-gray-200 !border-2 !border-white !shadow hover:!bg-[#342F2F] transition-colors"
                />
            )}
            {data.type !== 'output' && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="!w-2.5 !h-2.5 !bg-gray-200 !border-2 !border-white !shadow hover:!bg-[#342F2F] transition-colors"
                />
            )}
        </div>
    );
};

export default HeroNode;