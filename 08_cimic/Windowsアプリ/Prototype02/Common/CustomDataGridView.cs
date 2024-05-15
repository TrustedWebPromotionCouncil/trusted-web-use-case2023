using System;
using System.Windows.Forms;
using System.Drawing;

namespace Prototype02.Common
{


    //縦スクロールを表示するための継承クラス
    //https://noarts.net/archives/2703
    class CustomDataGridView : DataGridView
    {
        private const int CAPTIONHEIGHT = 1;
        private const int BORDERWIDTH = 2;

        /// <summary>
        /// Constructor
        /// </summary>        
        public CustomDataGridView() : base()
        {
            VerticalScrollBar.Visible = true;
            VerticalScrollBar.VisibleChanged += new EventHandler(VerticalScrollBar_VisibleChanged);
        }



        void VerticalScrollBar_VisibleChanged(object sender, EventArgs e)
        {
            if (!VerticalScrollBar.Visible)
            {
                int width = VerticalScrollBar.Width;

                VerticalScrollBar.Location =
                new Point(ClientRectangle.Width - width - BORDERWIDTH, CAPTIONHEIGHT);

                VerticalScrollBar.Size =
                new Size(width, ClientRectangle.Height - CAPTIONHEIGHT - BORDERWIDTH);

                VerticalScrollBar.Show();
            }
        }
    }
}
