const icons = {
    list: (
        <svg className="h-fit w-fit" fill="none" viewBox="0 0 24 24">
            <path className="fill-current" id="Vector" d="M5 17H19M5 12H19M5 7H19" stroke="currentColor" />
        </svg>
    ),

    close: (
        <svg className="w-fit h-fit p-1" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-current" d="M3 21.32L21 3.32001" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path className="fill-current" d="M3 3.32001L21 21.32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),

    github: (
        <svg className="w-6 h-6" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill="#000000">
                <g id="icons" transform="translate(56.000000, 160.000000)">
                    <path
                        className="fill-current"
                        d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
                        id="github-[#142]"
                    ></path>
                </g>
            </g>
        </svg>
    ),

    lightTheme: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path
                d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    darkTheme: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path
                d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    arrow: (
        <svg className="w-full h-full aspect-square" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 12H17M17 12L13 8M17 12L13 16" strokeWidth={1.5} stroke="currentColor" />
        </svg>
    ),

    weight: (
        <svg className="w-auto h-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M12 8L13 6M7.0998 7.0011C7.03435 7.32387 7 7.65792 7 8C7 10.7614 9.23858 13 12 13C14.7614 13 17 10.7614 17 8C17 7.65792 16.9656 7.32387 16.9002 7.0011M7.0998 7.0011C7.56264 4.71831 9.58065 3 12 3C14.4193 3 16.4374 4.71831 16.9002 7.0011M7.0998 7.0011C5.87278 7.00733 5.1837 7.04895 4.63803 7.32698C4.07354 7.6146 3.6146 8.07354 3.32698 8.63803C3 9.27976 3 10.1198 3 11.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V11.8C21 10.1198 21 9.27976 20.673 8.63803C20.3854 8.07354 19.9265 7.6146 19.362 7.32698C18.8163 7.04895 18.1272 7.00733 16.9002 7.0011" />
        </svg>
    ),

    oraLogo: (
        <svg
            className="w-fit h-6"
            width="206"
            height="66"
            viewBox="0 0 206 66"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <rect width="206" height="66" fill="url(#pattern0)" />
            <defs>
                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_316_107" transform="scale(0.00485437 0.0151515)" />
                </pattern>
                <image
                    id="image0_316_107"
                    width="206"
                    height="66"
                    xlinkHref="data:image/png;base64,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"
                />
            </defs>
        </svg>
    ),

    discordLogo: (
        <svg className="w-6 h-6 fill-light-text dark:fill-dark-text" fill="none" viewBox="0 0 512 512" aria-label="Discord">
            <rect fill="none" width="512" height="512" rx="15%" />
            <path
                stroke="currentColor"
                d="m386 137c-24-11-49.5-19-76.3-23.7c-.5 0-1 0-1.2.6c-3.3 5.9-7 13.5-9.5 19.5c-29-4.3-57.5-4.3-85.7 0c-2.6-6.2-6.3-13.7-10-19.5c-.3-.4-.7-.7-1.2-.6c-23 4.6-52.4 13-76 23.7c-.2 0-.4.2-.5.4c-49 73-62 143-55 213c0 .3.2.7.5 1c32 23.6 63 38 93.6 47.3c.5 0 1 0 1.3-.4c7.2-9.8 13.6-20.2 19.2-31.2c.3-.6 0-1.4-.7-1.6c-10-4-20-8.6-29.3-14c-.7-.4-.8-1.5 0-2c2-1.5 4-3 5.8-4.5c.3-.3.8-.3 1.2-.2c61.4 28 128 28 188 0c.4-.2.9-.1 1.2.1c1.9 1.6 3.8 3.1 5.8 4.6c.7.5.6 1.6 0 2c-9.3 5.5-19 10-29.3 14c-.7.3-1 1-.6 1.7c5.6 11 12.1 21.3 19 31c.3.4.8.6 1.3.4c30.6-9.5 61.7-23.8 93.8-47.3c.3-.2.5-.5.5-1c7.8-80.9-13.1-151-55.4-213c0-.2-.3-.4-.5-.4Zm-192 171c-19 0-34-17-34-38c0-21 15-38 34-38c19 0 34 17 34 38c0 21-15 38-34 38zm125 0c-19 0-34-17-34-38c0-21 15-38 34-38c19 0 34 17 34 38c0 21-15 38-34 38z"
            />
        </svg>
    ),

    discordBannerLogo: (
        <svg className="w-fit h-20" viewBox="0 -206 512 512" preserveAspectRatio="xMidYMid">
            <g>
                <path
                    className="fill-current"
                    d="M82.003081,0 C91.2633721,1.60390319 100.120889,4.42068908 108.404769,8.2965107 C122.889017,29.9266617 130.085793,54.3223748 127.428468,82.4600608 C116.346397,90.7462215 105.596579,95.7733519 95.0277993,99.0630814 C92.4108216,95.4753062 90.0957488,91.6508839 88.0927556,87.6415645 C91.9075296,86.1918592 95.5712634,84.4030589 99.0337857,82.316213 C98.1278953,81.6376723 97.2321795,80.9282569 96.356462,80.198317 C75.5511554,90.0471561 52.6723352,90.0471561 31.6154704,80.198317 C30.7499275,80.9282569 29.8540363,81.6376723 28.9381467,82.316213 C32.3904943,84.3928843 36.044229,86.1816846 39.859003,87.6312145 C37.8560098,91.6508839 35.5309378,95.4649562 32.9239592,99.0529068 C22.3653539,95.7631773 11.6255003,90.7358714 0.54343793,82.4600608 C-1.72128811,58.1878464 2.80815519,33.5660115 19.5168162,8.31703533 C27.8006964,4.43103911 36.6683882,1.60390319 45.9386784,0 C47.0861279,2.0561467 48.4449635,4.82170874 49.3608531,7.02170325 C59.0237427,5.54129868 68.7771511,5.54129868 78.6210784,7.02170325 C79.5371434,4.82170874 80.8658061,2.0561467 82.003081,0 Z M335.935532,31.686517 C342.980566,31.686517 348.829208,33.1977962 353.479703,36.2201792 L353.479703,49.3896225 C351.839487,48.2381383 349.925609,47.3026012 347.741578,46.5830112 C345.557547,45.8634213 343.222652,45.5034509 340.726366,45.5034509 C336.358304,45.5034509 332.946304,46.3156648 330.47984,47.9502672 C328.013376,49.5848696 326.776636,51.7129402 326.776636,54.3550037 C326.776636,56.9456678 327.973028,59.0635638 330.369323,60.7290409 C332.765617,62.3841679 336.237261,63.2169065 340.796535,63.2169065 C343.141956,63.2169065 345.457555,62.8672861 347.741578,62.1785708 C350.01683,61.4795055 351.979826,60.6262423 353.620042,59.6186059 L353.620042,72.3561549 C348.457309,75.5225611 342.468328,77.1057643 335.653099,77.1057643 C329.916728,77.0852396 325.024148,76.0777786 320.987638,74.0628566 C316.952882,72.0477592 313.902256,69.3132472 311.86909,65.8589699 C309.835924,62.4046925 308.809692,58.5186963 308.809692,54.2008058 C308.809692,49.8830907 309.865746,46.0176191 311.979607,42.6147411 C314.093468,39.211863 317.193213,36.538925 321.280596,34.5959268 C325.366225,32.6529287 330.24828,31.686517 335.935532,31.686517 Z M283.018831,31.6766932 C286.96412,31.6766932 290.577858,32.1084121 293.87057,32.9720253 C297.161527,33.8356385 299.878848,34.935548 302.043582,36.2822794 L302.043582,47.5806485 C299.827975,46.2339171 297.291341,45.1750568 294.393334,44.3730175 C291.504098,43.5815037 288.535921,43.1908341 285.474769,43.1908341 C281.055834,43.1908341 278.852507,43.9618233 278.852507,45.4936271 C278.852507,46.2133925 279.194584,46.74791 279.878738,47.1077049 C280.562892,47.4674999 281.820684,47.8376449 283.643341,48.2283145 L290.688375,49.5236466 C295.289751,50.3358605 298.721048,51.7648658 300.975249,53.8003124 C303.231204,55.8359345 304.357427,58.8481429 304.357427,62.8369377 C304.357427,67.2060521 302.496176,70.6706794 298.761396,73.240819 C295.026615,75.8109585 289.732314,77.0959405 282.867966,77.0959405 C278.831456,77.0857659 274.907217,76.5819477 271.102267,75.5744867 C267.297317,74.5670257 263.864266,73.1071457 260.815393,71.1846723 L260.815393,59.2388126 C263.120467,61.058312 266.209687,62.5594167 270.084807,63.7416001 C273.959927,64.913609 277.705233,65.4995258 281.327742,65.4995258 C283.018831,65.4995258 284.297673,65.273404 285.162514,64.8209851 C286.029109,64.3687416 286.462407,63.8238741 286.462407,63.1967327 C286.462407,62.4771427 286.230847,61.880876 285.757202,61.3975824 C285.283557,60.9144642 284.367843,60.5134446 283.010059,60.1741742 L274.554614,58.2311761 C269.712907,57.0798673 266.279856,55.4863141 264.237919,53.4405175 C262.194227,51.4048954 261.176767,48.7319573 261.176767,45.4217032 C261.176767,42.6356166 262.062659,40.2198503 263.855494,38.1533536 C265.63605,36.0870323 268.172683,34.4934791 271.463641,33.3728695 C274.756352,32.2420853 278.599896,31.6766932 283.018831,31.6766932 Z M512,23.8326015 L512,75.6464106 L494.736507,75.6464106 L494.736507,66.2192911 C493.276978,69.766017 491.063125,72.4698297 488.084423,74.3202039 C485.103966,76.1605788 481.420058,77.0857659 477.051997,77.0857659 C473.147055,77.0857659 469.74558,76.1193542 466.835293,74.1763561 C463.92676,72.2333579 461.683085,69.5707699 460.102513,66.1884165 C458.532467,62.8060631 457.736041,58.9818161 457.736041,54.7051503 C457.686922,50.2948112 458.521942,46.3367157 460.242853,42.8310391 C461.954993,39.3253625 464.379355,36.5908505 467.500151,34.6271523 C470.620947,32.6636296 474.183811,31.6766932 478.179974,31.6766932 C486.262068,31.6766932 491.728206,35.2014569 494.588378,42.2413268 L494.736,42.614 L494.736507,23.8326015 L512,23.8326015 Z M385.466546,31.6663432 C391.053806,31.6663432 395.874462,32.6224049 399.910972,34.5448784 C403.947482,36.4673519 407.027931,39.0992407 409.141792,42.4608941 C411.255653,45.8227229 412.311707,49.6778444 412.311707,54.0471342 C412.311707,58.3648493 411.255653,62.2715456 409.141792,65.7770468 C407.027931,69.2827234 403.936957,72.0379354 399.870625,74.0528574 C395.804292,76.0679549 391.002933,77.0754159 385.457775,77.0754159 C379.910862,77.0754159 375.109503,76.0781295 371.053696,74.0632075 C366.987364,72.0482854 363.887619,69.2930734 361.752707,65.7873968 C359.619549,62.2817202 358.542444,58.3751994 358.542444,54.0573088 C358.542444,49.7395937 359.609023,45.8842968 361.752707,42.5021188 C363.89639,39.1197653 366.976838,36.4673519 371.023874,34.5448784 C375.05863,32.6224049 379.88104,31.6663432 385.466546,31.6663432 Z M253.107255,43.4681797 L253.107255,75.8723569 L235.89639,75.8723569 L235.89639,43.4681797 C241.169641,45.7914974 247.712962,45.8942959 253.107255,43.4681797 Z M448.235068,32.6120549 C450.720829,32.6120549 452.855741,33.187797 454.646822,34.3391059 L454.646822,49.8832661 C452.855741,48.6803826 450.540142,48.0841159 447.671957,48.0841159 C443.916125,48.0841159 441.018118,49.2459501 439.004248,51.5692678 C436.981608,53.892761 435.974673,57.5114108 435.974673,62.404868 L435.974673,75.6462352 L418.712935,75.6462352 L418.712935,33.547592 L435.623825,33.547592 L435.623825,46.932807 C436.558835,42.0391744 438.079763,38.4308746 440.172573,36.0970315 C442.256613,33.7737138 444.952882,32.6120549 448.235068,32.6120549 Z M199.445002,25.2717814 C206.069018,25.2717814 211.665049,26.3306416 216.2559,28.4381876 C220.834471,30.5455582 224.267522,33.4858427 226.542773,37.2485157 C228.816271,41.0111887 229.963545,45.3187292 229.963545,50.1711372 C229.963545,54.9207466 228.775923,59.2282871 226.40068,63.0834087 C224.025437,66.9488803 220.411699,70.0023134 215.550695,72.2537072 C210.689691,74.505101 204.669134,75.6358852 197.473234,75.6358852 L171.967086,75.6358852 L171.967086,25.2717814 L199.445002,25.2717814 Z M42.7277144,41.348354 C36.2959626,41.348354 31.2228711,47.2596223 31.2228711,54.445698 C31.2228711,61.6317737 36.4066553,67.5328673 42.7277144,67.5328673 C49.1596416,67.5328673 54.2425569,61.6317737 54.2325578,54.445698 C54.3432504,47.2492722 49.1596416,41.348354 42.7277144,41.348354 Z M85.244218,41.348354 C78.8122908,41.348354 73.7393746,47.2596223 73.7393746,54.445698 C73.7393746,61.6317737 78.9231588,67.5328673 85.244218,67.5328673 C91.6759697,67.5328673 96.7490613,61.6317737 96.7490613,54.445698 C96.859754,47.2492722 91.6759697,41.348354 85.244218,41.348354 Z M385.457775,44.928235 C382.447496,44.928235 380.091549,45.7814982 378.370638,47.4880245 C376.660253,49.1947263 375.804183,51.4769947 375.804183,54.3555299 C375.804183,57.2340651 376.660253,59.5472082 378.370638,61.2947838 C380.082778,63.0425348 382.447496,63.9266726 385.457775,63.9266726 C388.415426,63.9163226 390.752076,63.0425348 392.462462,61.2947838 C394.174602,59.5472082 395.039443,57.2340651 395.039443,54.3555299 C395.039443,51.4769947 394.183373,49.1843762 392.462462,47.4880245 C390.752076,45.7814982 388.415426,44.928235 385.457775,44.928235 Z M485.225009,45.1441822 C482.316476,45.1441822 479.992106,45.9974454 478.250144,47.7039717 C476.508182,49.4106734 475.643341,51.6208425 475.643341,54.3555299 C475.643341,57.0902173 476.508182,59.3210865 478.250144,61.0481374 C479.992106,62.7751884 482.286654,63.6388016 485.154839,63.6388016 C488.063372,63.628627 490.398267,62.7546638 492.16128,61.0070882 C493.922539,59.2593372 494.797906,56.9874188 494.797906,54.2116821 C494.797906,51.528394 493.941836,49.3385741 492.23145,47.6629224 C490.51931,45.9872707 488.173889,45.1441822 485.225009,45.1441822 Z M198.18721,38.0812543 L189.591426,38.0812543 L189.591426,62.8367623 L197.190801,62.8367623 C201.650084,62.8367623 205.083135,61.6956281 207.477675,59.4235342 C209.873969,57.1412658 211.072116,54.0366088 211.072116,50.0992133 C211.072116,46.4495134 210.003783,43.5401036 207.870625,41.3606337 C205.737467,39.1811638 202.506154,38.0812543 198.18721,38.0812543 Z M244.509717,22.2386975 C249.261958,22.2386975 253.116027,25.7734945 253.116027,30.1340131 C253.116027,34.4945317 249.261958,38.0295041 244.509717,38.0295041 C239.755722,38.0295041 235.903407,34.4945317 235.903407,30.1340131 C235.903407,25.7734945 239.755722,22.2386975 244.509717,22.2386975 Z"
                    fill="#5865F2"
                ></path>
            </g>
        </svg>
    ),
}

export default icons
