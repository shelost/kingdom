import sys,re
f,term=sys.argv[1],sys.argv[2]; n=int(sys.argv[3]) if len(sys.argv)>3 else 150
t=open(f,encoding='utf-8').read()
for m in re.finditer(re.escape(term),t):
    print('>>',t[max(0,m.start()-n):m.end()+n].replace('\n',' '),'\n')
