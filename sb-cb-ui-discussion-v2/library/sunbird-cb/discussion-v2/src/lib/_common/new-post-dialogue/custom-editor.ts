import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Bold, Italic, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { List } from '@ckeditor/ckeditor5-list';
import { Link } from '@ckeditor/ckeditor5-link';

export const CustomEditor = ClassicEditor.builtinPlugins = [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    Heading,
    List,
    Link
];

export const editorConfig = {
    plugins: CustomEditor,
    toolbar: {
        items: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'link',
            '|',
            'undo',
            'redo'
        ]
    }
}; 