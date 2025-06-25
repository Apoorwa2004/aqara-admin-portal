import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import {
  Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, Heading2, Pilcrow
} from 'lucide-react';
import { useEffect } from 'react';

const AboutEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value || '',
    editorProps: {
      attributes: {
        style:
          'color: white; background-color: #162a45; min-height: 150px; padding: 12px; border-radius: 8px; border: 1px solid black;',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // ✅ This syncs the editor when `value` changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <Box sx={{ backgroundColor: '#0b1727', borderRadius: 1 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1, px: 1 }}>
        <Tooltip title="Bold">
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            sx={{ color: 'white' }}
          >
            <Bold size={18} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            sx={{ color: 'white' }}
          >
            <Italic size={18} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            sx={{ color: 'white' }}
          >
            <UnderlineIcon size={18} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bullet List">
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            sx={{ color: 'white' }}
          >
            <List size={18} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List">
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            sx={{ color: 'white' }}
          >
            <ListOrdered size={18} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Heading 2">
          <IconButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            sx={{ color: 'white' }}
          >
            <Heading2 size={18} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Paragraph">
          <IconButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            sx={{ color: 'white' }}
          >
            <Pilcrow size={18} />
          </IconButton>
        </Tooltip>
      </Stack>

      <EditorContent editor={editor} />
    </Box>
  );
};

export default AboutEditor;
