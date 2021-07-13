function Sleep(delay) {
    var begin = (new Date()).getTime();
    console.log(begin);
    while((new Date()).getTime() < begin + delay) {
        continue;
    }
}