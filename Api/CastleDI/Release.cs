using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.CastleDI
{
    public class Release : IDisposable
    {
        public Action action;
        public Release(Action action)
        {
            this.action = action;
        }

        public void Dispose()
        {
            this.action();
        }
    }
}
