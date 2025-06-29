
import Workspace from '@/components/workspace/Workspace';
import { getGuideBySlug } from '@/lib/api';
import {convertMarkdownToHtml} from '@/lib/utils'

interface GuidesEditContentProps {
    params: {
        slug: string;
    }
}

async function GuidesEditContent({params}: GuidesEditContentProps) {
    const { slug } = await params;
    const guide = await getGuideBySlug(slug);
    if (!guide) return <>Error</>
    const content = convertMarkdownToHtml(guide.content || "")
    return <Workspace initData={{content: content, ...guide}} />
}

export default GuidesEditContent;
